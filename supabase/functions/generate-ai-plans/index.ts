import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EventRequestData {
  eventRequestId: string;
  eventType: string;
  budget: number;
  guestCount: number;
  venueType: string;
  timeOfDay: string;
  eventScale: string;
  location: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { eventRequestId, eventType, budget, guestCount, venueType, timeOfDay, eventScale, location }: EventRequestData = await req.json();

    console.log("Generating AI plans for event:", { eventRequestId, eventType, budget, guestCount });

    const systemPrompt = `You are an expert event planner for "The Dreamers Event" company in India. Generate comprehensive event plans based on the requirements. You must return a valid JSON array with exactly 3 plans.

Each plan should include:
- plan_name: Name of the plan (Plan A - Premium, Plan B - Balanced, Plan C - Budget)
- plan_type: "premium" | "balanced" | "budget"
- description: Brief description of the overall theme
- decoration_items: Array of decoration items with name, quantity, and cost
- lighting_setup: Object with type, items, and total_cost
- entry_design: Object with concept, elements, and cost
- stage_design: Object with design, dimensions, and cost (can be null for smaller events)
- dj_setup: Object with equipment, duration, and cost (can be null if not needed)
- estimated_cost: Total estimated cost in INR
- profit_margin: Suggested profit margin percentage (10-25%)

Consider Indian market pricing and preferences. All costs should be in Indian Rupees (INR).`;

    const userPrompt = `Generate 3 comprehensive event plans for the following requirements:

Event Type: ${eventType}
Budget: ₹${budget.toLocaleString('en-IN')}
Number of Guests: ${guestCount}
Venue Type: ${venueType}
Time of Day: ${timeOfDay}
Event Scale: ${eventScale}
Location: ${location}

Generate:
1. Plan A (Premium): Uses 90-100% of budget with grand decorations, premium lighting, elaborate stage, and full DJ setup
2. Plan B (Balanced): Uses 70-85% of budget with elegant decorations, smart lighting, stylish stage, and standard DJ
3. Plan C (Budget): Uses 50-65% of budget with simple decorations, basic lighting, minimal stage, and limited DJ

Return ONLY a valid JSON array with exactly 3 plan objects. No additional text or explanation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI response content:", content);

    // Parse the JSON response - handle markdown code blocks
    let plans;
    try {
      let jsonContent = content.trim();
      // Remove markdown code blocks if present
      if (jsonContent.startsWith("```json")) {
        jsonContent = jsonContent.slice(7);
      } else if (jsonContent.startsWith("```")) {
        jsonContent = jsonContent.slice(3);
      }
      if (jsonContent.endsWith("```")) {
        jsonContent = jsonContent.slice(0, -3);
      }
      plans = JSON.parse(jsonContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Failed to parse AI-generated plans");
    }

    if (!Array.isArray(plans) || plans.length !== 3) {
      throw new Error("Invalid plans format from AI");
    }

    // Store plans in the database
    const insertPromises = plans.map(async (plan: any) => {
      const { error } = await supabase.from("ai_plans").insert({
        event_request_id: eventRequestId,
        plan_name: plan.plan_name,
        plan_type: plan.plan_type,
        description: plan.description,
        decoration_items: plan.decoration_items || [],
        lighting_setup: plan.lighting_setup || {},
        entry_design: plan.entry_design || {},
        stage_design: plan.stage_design || null,
        dj_setup: plan.dj_setup || null,
        estimated_cost: plan.estimated_cost,
        profit_margin: plan.profit_margin || 15,
      });

      if (error) {
        console.error("Error inserting plan:", error);
        throw error;
      }
    });

    await Promise.all(insertPromises);

    // Update event request status
    await supabase
      .from("event_requests")
      .update({ status: "plans_generated" })
      .eq("id", eventRequestId);

    console.log("Successfully generated and stored 3 AI plans");

    return new Response(
      JSON.stringify({ success: true, message: "3 AI plans generated successfully", plansCount: 3 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-ai-plans function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  to: string;
  type: 'budget_alert' | 'large_expense' | 'weekly_summary' | 'monthly_report' | 'transaction_reminder';
  data: any;
}

const getEmailContent = (type: string, data: any) => {
  switch (type) {
    case 'budget_alert':
      return {
        subject: "🚨 Alerta de Presupuesto - FinanceApp",
        html: `
          <h2>⚠️ Has superado tu presupuesto</h2>
          <p>Tu gasto actual es de <strong>$${data.currentAmount}</strong>, superando tu límite de <strong>$${data.budgetLimit}</strong>.</p>
          <p>Te recomendamos revisar tus gastos recientes y considerar ajustar tu presupuesto.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Este es un mensaje automático de tu app de finanzas personales.</p>
        `
      };
    case 'large_expense':
      return {
        subject: "💸 Gasto Grande Detectado - FinanceApp", 
        html: `
          <h2>💰 Gasto significativo registrado</h2>
          <p>Se ha registrado un gasto de <strong>$${data.amount}</strong> en la categoría <strong>${data.category}</strong>.</p>
          <p>Descripción: ${data.description || 'Sin descripción'}</p>
          <p>Fecha: ${new Date(data.date).toLocaleDateString('es-ES')}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Este es un mensaje automático de tu app de finanzas personales.</p>
        `
      };
    case 'weekly_summary':
      return {
        subject: "📊 Resumen Semanal - FinanceApp",
        html: `
          <h2>📈 Resumen de la semana</h2>
          <p><strong>Ingresos:</strong> $${data.income}</p>
          <p><strong>Gastos:</strong> $${data.expenses}</p>
          <p><strong>Balance:</strong> $${data.balance}</p>
          <p><strong>Transacciones:</strong> ${data.transactionCount}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Este es un mensaje automático de tu app de finanzas personales.</p>
        `
      };
    case 'monthly_report':
      return {
        subject: "📈 Reporte Mensual - FinanceApp",
        html: `
          <h2>📊 Reporte del mes</h2>
          <p><strong>Ingresos totales:</strong> $${data.totalIncome}</p>
          <p><strong>Gastos totales:</strong> $${data.totalExpenses}</p>
          <p><strong>Ahorro:</strong> $${data.savings}</p>
          <p><strong>Categoría con más gastos:</strong> ${data.topCategory}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Este es un mensaje automático de tu app de finanzas personales.</p>
        `
      };
    case 'transaction_reminder':
      return {
        subject: "⏰ Recordatorio de Transacción - FinanceApp",
        html: `
          <h2>📝 No olvides registrar tus transacciones</h2>
          <p>¡Hola! Te recordamos que mantengas actualizado tu registro de transacciones.</p>
          <p>Una buena gestión financiera requiere consistencia en el registro de ingresos y gastos.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Este es un mensaje automático de tu app de finanzas personales.</p>
        `
      };
    default:
      return {
        subject: "Notificación - FinanceApp",
        html: "<p>Tienes una nueva notificación de tu app de finanzas.</p>"
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, type, data }: NotificationEmailRequest = await req.json();

    if (!to || !type) {
      return new Response(
        JSON.stringify({ error: "Email y tipo de notificación son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { subject, html } = getEmailContent(type, data);

    console.log(`Sending ${type} email to ${to}`);

    const emailResponse = await resend.emails.send({
      from: "FinanceApp <notifications@resend.dev>",
      to: [to],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse.data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error sending notification email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
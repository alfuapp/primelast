import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Geli API Key-ga aad Resend ka soo qaadatay
const resend = new Resend('re_LHp8JR7i_P3aDspZsnzSMFMWUECskGZH7'); 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { etunimi, sukunimi, puh, email, viesti, orderId } = body;

    const { data, error } = await resend.emails.send({
      from: 'PrimeCare <onboarding@resend.dev>', // Ha beddelin tani waa tijaabada
      to: ['primecare1974@gmail.com'], // Iimaylkaaga rasmiga ah
      subject: `Uusi Tilaus: ${orderId} - ${etunimi}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #006d67; border-radius: 10px;">
          <h2 style="color: #006d67;">Uusi tilaus ilmoitus</h2>
          <p><strong>Asiakas:</strong> ${etunimi} ${sukunimi}</p>
          <p><strong>Puhelin:</strong> ${puh}</p>
          <p><strong>Sähköposti:</strong> ${email}</p>
          <p><strong>Viesti:</strong> ${viesti}</p>
          <p><strong>Tilausnumero:</strong> ${orderId}</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
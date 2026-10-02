/** Celular argentino ("11 2345 6789") → link de WhatsApp con mensaje prearmado. */
export function waLink(phone: string, text?: string) {
  let digits = phone.replace(/\D/g, '');
  if (!digits.startsWith('54')) digits = '549' + digits.replace(/^0/, '');
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

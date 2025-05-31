import bcrypt from "bcrypt";
export async function GET(request: Request) {
    const hashPassword = await bcrypt.hash("Senha123", 10);
    return new Response(JSON.stringify({ hashPassword }));
}

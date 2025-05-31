import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import * as bcrypt from "bcrypt";

type typeUsuario = {
  nome: string;
  id: number;
};

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: typeUsuario;
  }
  interface User extends typeUsuario {}
}
declare module "next-auth/jwt" {
  interface JWT extends typeUsuario {}
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { type: "email", label: "Email" },
        senha: { type: "password", label: "Senha" },
      },

      authorize: async (credentials) => {
        console.log("credentials", credentials);
        let user = null;
        const res = await fetch(`http://backend:4000/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            senha: credentials.senha,
          }),
          cache: "no-cache",
        });

        const getUser = await res.json();

        if (
          (await bcrypt.compare(getUser.email, credentials.senha as string)) &&
          !getUser.erro
        ) {
          const { senha, ...resto } = getUser;
          user = resto;

          // return user object with their profile data
          return user as any;
        } else {
          throw new Error(
            "Usuário Não Encontrado.\n Verifique suas credencias e tente novamente.",
          );
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = parseInt(user.id!);
        token.nome = user.nome;
      }
      return token;
    },
    session({ session, token }) {
      //@ts-ignore
      session.user.id = token.id;
      return session;
    },
  },
});

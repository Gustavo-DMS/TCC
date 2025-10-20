import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import { fetchAPIs } from "@/lib/utils";

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
        email: {},
        senha: {},
      },

      authorize: async (credentials) => {
        console.log("credentials", credentials);
        let user = null;
        console.log("Iniciando autorização");

        const res = await fetchAPIs(
          `/auth`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              senha: credentials.senha,
            }),
            cache: "no-cache",
          },
          true,
        );

        const getUser = await res.json();
        console.log("getUser", getUser[0]);

        if (
          (await bcrypt.compare(
            credentials.senha as string,
            getUser[0].senha,
          )) &&
          !getUser.erro
        ) {
          const { senha, ...resto } = getUser[0];
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
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      //@ts-ignore
      session.user.id = token.id;
      session.user.nome = token.nome;
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});

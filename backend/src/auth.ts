import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password", placeholder: "admin" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        
        // Simple hardcoded admin credentials
        // In production, verify against Supabase or your database
        if (credentials.username === "admin" && credentials.password === "admin") {
          return { 
            id: "1", 
            name: "Admin User", 
            email: "admin@example.com", 
            role: "admin" 
          }
        }
        
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // user object is available only during sign in
        token.role = user.role as string
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
})

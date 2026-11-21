import { Playfair_Display } from "next/font/google";
import PecaTabuleiro3D from "../components/PecaTabuleiro3D";
import { AuthProvider } from "../contexts/AuthContext";
import LayoutPadrao from "../layouts/LayoutPadrao";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata = {
  title: "Aluguel de Jogos | UFCI - RJ",
  description: "Sistema de aluguel de jogos de tabuleiro da UFCI - RJ.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={playfair.variable}>
      <body>
        <PecaTabuleiro3D />
        <AuthProvider>
          <LayoutPadrao>{children}</LayoutPadrao>
        </AuthProvider>
      </body>
    </html>
  );
}

// Gerado/espelho dos .json â€” manter sincronizado ao editar os arquivos JSON.
// Fonte de verdade: banco de dados/livros.json e banco de dados/encontros.json
window.DB_FIXO = {
  livros: [
    {
      id: "flor-do-vento",
      titulo: "Flor do Vento",
      autor: "Raianne Viana",
      imagem: "imagens/flor-do-vento.jpg",
      alt: "Capa do livro Flor do Vento",
      dataNome: "flor do vento raianne viana",
      resumo: "Flor do Vento apresenta uma narrativa marcada por sentimentos, descobertas e experiÃªncias humanas. A obra convida o leitor a acompanhar seus personagens em uma jornada de amadurecimento e reflexÃ£o.",
      amazonUrl: "https://www.amazon.com.br/s?k=Flor+do+Vento+Raianne+Viana"
    },
    {
      id: "marina-a-vida-por-uma-causa",
      titulo: "Marina: A Vida por uma Causa",
      autor: "MarÃ­lia de Camargo CÃ©sar",
      imagem: "imagens/marina.jpg",
      alt: "Capa do livro Marina - A Vida por uma Causa",
      dataNome: "marina a vida por uma causa marilia de camargo cesar",
      resumo: "A obra apresenta a trajetÃ³ria de Marina Silva, passando por momentos de sua vida pessoal, desafios, formaÃ§Ã£o e participaÃ§Ã£o em questÃµes ambientais e sociais.",
      amazonUrl: "https://www.amazon.com.br/s?k=Marina+A+Vida+por+uma+Causa+Marilia+de+Camargo+Cesar"
    },
    {
      id: "ficcoes",
      titulo: "FicÃ§Ãµes",
      autor: "Jorge Luis Borges",
      imagem: "imagens/ficcoes.jpg",
      alt: "Capa do livro FicÃ§Ãµes",
      dataNome: "ficcoes jorge luis borges",
      resumo: "FicÃ§Ãµes reÃºne contos de Jorge Luis Borges que exploram temas como labirintos, tempo, infinito, identidade, livros imaginÃ¡rios e os limites entre realidade e fantasia.",
      amazonUrl: "https://www.amazon.com.br/s?k=Ficcoes+Jorge+Luis+Borges"
    },
    {
      id: "aruanda",
      titulo: "Aruanda",
      autor: "Robson Pinheiro",
      imagem: "imagens/aruanda.jpg",
      alt: "Capa do livro Aruanda",
      dataNome: "aruanda robson pinheiro",
      resumo: "Aruanda apresenta uma narrativa espiritualista que aborda questÃµes relacionadas Ã  espiritualidade, aprendizado, transformaÃ§Ã£o e diferentes experiÃªncias do mundo espiritual.",
      amazonUrl: "https://www.amazon.com.br/s?k=Aruanda+Robson+Pinheiro"
    }
  ],
  encontros: {
    proximo: {
      etiqueta: "PRÃ“XIMO ENCONTRO",
      titulo: "DiscussÃ£o: \"FicÃ§Ãµes\" de Jorge Luis Borges",
      dataHoraTexto: "25 de Junho, Ã s 19:30",
      modalidade: "Online",
      meetUrl: "https://meet.google.com/abc-defg-hij"
    },
    agenda: [
      {
        mes: "JUL",
        dia: "12",
        titulo: "Debate: Flor do Vento",
        mediacaoOuLocal: "MediaÃ§Ã£o: Raianne Viana",
        detalhes: null
      },
      {
        mes: "AGO",
        dia: "05",
        titulo: "Workshop: Escrita Criativa",
        mediacaoOuLocal: "Encontro Online",
        detalhes: "Workshop de Escrita Criativa - 05 de Agosto."
      }
    ]
  }
};


// Gerado/espelho dos .json — manter sincronizado ao editar os arquivos JSON.
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
      resumo: "Flor do Vento apresenta uma narrativa marcada por sentimentos, descobertas e experiências humanas. A obra convida o leitor a acompanhar seus personagens em uma jornada de amadurecimento e reflexão.",
      amazonUrl: "https://www.amazon.com.br/s?k=Flor+do+Vento+Raianne+Viana"
    },
    {
      id: "marina-a-vida-por-uma-causa",
      titulo: "Marina: A Vida por uma Causa",
      autor: "María de Camargo César",
      imagem: "imagens/marina.jpg",
      alt: "Capa do livro Marina - A Vida por uma Causa",
      dataNome: "marina a vida por uma causa marilia de camargo cesar",
      resumo: "A obra apresenta a trajetória de Marina Silva, passando por momentos de sua vida pessoal, desafios, formação e participação em questões ambientais e sociais.",
      amazonUrl: "https://www.amazon.com.br/s?k=Marina+A+Vida+por+uma+Causa+Marilia+de+Camargo+Cesar"
    },
    {
      id: "ficcoes",
      titulo: "Ficções",
      autor: "Jorge Luis Borges",
      imagem: "imagens/ficcoes.jpg",
      alt: "Capa do livro Ficções",
      dataNome: "ficcoes jorge luis borges",
      resumo: "Ficções reúne contos de Jorge Luis Borges que exploram temas como labirintos, tempo, infinito, identidade, livros imaginários e os limites entre realidade e fantasia.",
      amazonUrl: "https://www.amazon.com.br/s?k=Ficcoes+Jorge+Luis+Borges"
    },
    {
      id: "aruanda",
      titulo: "Aruanda",
      autor: "Robson Pinheiro",
      imagem: "imagens/aruanda.jpg",
      alt: "Capa do livro Aruanda",
      dataNome: "aruanda robson pinheiro",
      resumo: "Aruanda apresenta uma narrativa espiritualista que aborda questões relacionadas à espiritualidade, aprendizado, transformação e diferentes experiências do mundo espiritual.",
      amazonUrl: "https://www.amazon.com.br/s?k=Aruanda+Robson+Pinheiro"
    }
  ],
  encontros: {
    proximo: {
      etiqueta: "PRÓXIMO ENCONTRO",
      titulo: "Discussão: \"Ficções\" de Jorge Luis Borges",
      dataHoraTexto: "25 de Junho, às 19:30",
      modalidade: "Online",
      meetUrl: "https://meet.google.com/abc-defg-hij"
    },
    agenda: [
      {
        mes: "JUL",
        dia: "12",
        titulo: "Debate: Flor do Vento",
        mediacaoOuLocal: "Mediação: Raianne Viana",
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


export interface ChecklistItem {
  name: string;
}

export interface ChecklistSubCategory {
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistCategory {
  title: string;
  subcategories: ChecklistSubCategory[];
}

export const luggageData: ChecklistCategory[] = [
  {
    title: 'Documentos e Reservas',
    subcategories: [
      {
        title: 'Documentos Pessoais',
        items: [
          { name: 'RG (todos os passageiros)' },
          { name: 'Comprovante do Seguro Saúde' },
        ],
      },
      {
        title: 'Comprovantes e Vouchers',
        items: [
            { name: 'Comprovante de reserva do hotel' },
            { name: 'Comprovante de passagens aéreas' },
            { name: 'Vouchers de passeios e transfers' },
        ]
      }
    ],
  },
  {
    title: 'David',
    subcategories: [
      {
        title: 'Roupas',
        items: [
          { name: '2 calças leves (jeans + sarja)' },
          { name: '1 bermuda casual' },
          { name: '5 camisetas (algodão ou dry-fit)' },
          { name: '1 camisa polo' },
          { name: '1 blusa de frio leve (moletom)' },
          { name: '1 jaqueta corta-vento (essencial à noite)' },
          { name: '1 jaqueta jeans ou bomber' },
          { name: '1 tênis confortável para caminhada' },
          { name: '1 par de chinelos' },
          { name: '1 boné ou chapéu' },
          { name: '7 cuecas' },
          { name: '5 pares de meias' },
        ],
      },
      {
        title: 'Acessórios',
        items: [
          { name: 'Óculos de sol' },
          { name: 'Relógio' },
          { name: 'Cinto' },
          { name: 'Adaptadores de tomada (tipo C e L)' },
        ],
      },
    ],
  },
  {
    title: 'Rafaella',
    subcategories: [
      {
        title: 'Roupas',
        items: [
          { name: '2 calças leves (jeans + legging)' },
          { name: '1 vestido casual' },
          { name: '1 saia ou bermuda' },
          { name: '5 blusas leves' },
          { name: '1 cardigã ou moletom' },
          { name: '1 jaqueta corta-vento ou jeans' },
          { name: '1 casaco leve para noite' },
          { name: '1 tênis confortável' },
          { name: '1 sandália baixa' },
          { name: '1 par de chinelos' },
          { name: '7 calcinhas' },
          { name: '3 sutiãs' },
          { name: '3 pares de meias' },
        ],
      },
      {
        title: 'Acessórios',
        items: [
          { name: 'Óculos de sol' },
          { name: 'Chapéu ou boné' },
          { name: 'Bolsa de ombro e pochete de passeio' },
          { name: 'Power bank e carregadores' },
        ],
      },
    ],
  },
  {
    title: 'Joe',
    subcategories: [
      {
        title: 'Roupas',
        items: [
          { name: '3 bermudas' },
          { name: '2 calças leves' },
          { name: '6 camisetas' },
          { name: '1 blusa de frio leve' },
          { name: '1 jaqueta corta-vento infantil' },
          { name: '1 pijama leve + 1 pijama longo' },
          { name: '1 tênis confortável' },
          { name: '1 par de sandálias' },
          { name: '1 boné' },
          { name: '7 cuequinhas' },
          { name: '5 pares de meias' },
        ],
      },
      {
        title: 'Outros',
        items: [
          { name: 'Brinquedos pequenos e tablet' },
          { name: 'Casaco reserva' },
          { name: 'Lanchinhos leves' },
          { name: 'Garrafinha d’água' },
        ],
      },
    ],
  },
  {
    title: 'Itens de Higiene e Farmácia (para toda a família)',
    subcategories: [
      {
        title: 'Higiene Pessoal',
        items: [
          { name: 'Escovas e pastas de dente' },
          { name: 'Fio dental' },
          { name: 'Desodorantes' },
          { name: 'Shampoo e condicionador' },
          { name: 'Sabonete corporal e íntimo' },
          { name: 'Hidratante corporal e facial' },
          { name: 'Protetor solar (adulto e infantil)' },
          { name: 'Protetor labial' },
          { name: 'Perfume' },
          { name: 'Escovas de cabelo e pentes' },
          { name: 'Toalhas de rosto e corpo' },
          { name: 'Lâminas de barbear / depilação' },
          { name: 'Lenços umedecidos' },
          { name: 'Demaquilante e algodão' },
          { name: 'Fraldas noturnas (se necessário)' },
        ],
      },
      {
        title: 'Farmácia',
        items: [
          { name: 'Analgésicos e antitérmicos (paracetamol / ibuprofeno)' },
          { name: 'Antialérgicos (adulto e infantil)' },
          { name: 'Remédio para cólica e enjoo' },
          { name: 'Pomada para assadura e picada de inseto' },
          { name: 'Curativos (band-aids, gaze, esparadrapo)' },
          { name: 'Termômetro' },
          { name: 'Repelente (adulto e infantil)' },
          { name: 'Álcool 70% (gel ou spray)' },
          { name: 'Soro fisiológico e cotonetes' },
          { name: 'Medicamentos de uso contínuo (com receita médica)' },
          { name: 'Pomada para irritações de pele' },
          { name: 'Colírio lubrificante (caso o clima seco incomode)' },
        ],
      },
    ],
  },
];
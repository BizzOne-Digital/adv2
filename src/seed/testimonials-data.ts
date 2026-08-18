export type TestimonialSeed = {
  personName: string;
  role: string;
  quote: string;
  featured?: boolean;
  imageIndex: number;
};

export const TESTIMONIAL_SEEDS: TestimonialSeed[] = [
  {
    personName: "Amara Osei",
    role: "Newcomer · Settlement & orientation",
    quote:
      "When I arrived in Toronto, I did not know how to open a bank account or register my children for school. The settlement team walked me through every step without making me feel rushed. Today my family has a routine, and I know where to go when something new comes up.",
    featured: true,
    imageIndex: 10,
  },
  {
    personName: "Rajesh Patel",
    role: "Parent · Family wellbeing workshops",
    quote:
      "Parenting in a new country brings questions you cannot always ask friends. The family workshops gave me space to learn about Ontario schools and meet other parents who understood the pressure of starting over.",
    featured: true,
    imageIndex: 14,
  },
  {
    personName: "Fatima Al-Hassan",
    role: "Youth · Mentorship program",
    quote:
      "My mentor did not just help with homework — she showed me how to speak up in class and prepare for my first job interview. I feel more confident about university next year.",
    featured: true,
    imageIndex: 18,
  },
  {
    personName: "Elena Vasquez",
    role: "Volunteer · Welcome days",
    quote:
      "I volunteer at welcome days because I remember how lonely my first month felt. A warm greeting and a clear map of the neighbourhood can change someone's entire week.",
    featured: false,
    imageIndex: 22,
  },
  {
    personName: "Wei Chen",
    role: "Senior · Social connection group",
    quote:
      "The tea circles are where I found people who speak my language and share memories of home. We laugh, we learn about senior benefits, and we look after each other.",
    featured: false,
    imageIndex: 26,
  },
  {
    personName: "Daniel Okonkwo",
    role: "Workshop attendee · Digital skills",
    quote:
      "I had years of work experience but struggled with online job portals. After the digital skills workshop, I submitted applications on my own and landed a role within two months.",
    featured: false,
    imageIndex: 30,
  },
  {
    personName: "Maria Santos",
    role: "Employment readiness program",
    quote:
      "They helped me rewrite my résumé for Canadian employers and practise interviews until the nerves faded. No one promised me a job — they gave me tools I actually use every week.",
    featured: false,
    imageIndex: 34,
  },
  {
    personName: "Yusuf Ibrahim",
    role: "Language conversation circles",
    quote:
      "Speaking English at the grocery store used to make me anxious. Conversation circles were small, patient, and full of people learning just like me.",
    featured: false,
    imageIndex: 38,
  },
  {
    personName: "Priya Nair",
    role: "Advocacy & civic engagement workshop",
    quote:
      "I learned how to share my story with local officials without feeling invisible. Our community's voice matters, and this team helped me believe I could be part of that conversation.",
    featured: false,
    imageIndex: 42,
  },
  {
    personName: "James O'Brien",
    role: "Community partner · Volunteer network",
    quote:
      "I've seen how practical support — a referral, a workshop, a follow-up call — keeps families from falling through gaps in the system. This work is done with dignity and real care.",
    featured: false,
    imageIndex: 46,
  },
];

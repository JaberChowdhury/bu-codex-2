import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const maleImg = "https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133352010-stock-illustration-default-placeholder-man-and-woman.jpg";
const femaleImg = "https://st4.depositphotos.com/9998432/24360/v/450/depositphotos_243600690-stock-illustration-person-gray-photo-placeholder-girl.jpg";

const firstNamesMale = ["Ahmad", "Jaber", "Rahim", "Kareem", "Omar", "Hasan", "Ali", "Tariq"];
const firstNamesFemale = ["Fatima", "Aisha", "Mariam", "Sara", "Noor", "Huda", "Layla", "Zainab"];
const lastNames = ["Khan", "Ahmed", "Rahman", "Chowdhury", "Hossain", "Uddin", "Ali", "Islam"];

function randomChoice(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMember() {
  const isMale = Math.random() > 0.3; // 70% chance male just for variety
  const firstName = randomChoice(isMale ? firstNamesMale : firstNamesFemale);
  const lastName = randomChoice(lastNames);
  const gender = isMale ? "male" : "female";
  
  return {
    fullName: `${firstName} ${lastName}`,
    studentId: `2024${Math.floor(10000000 + Math.random() * 90000000)}`,
    batch: "24",
    section: randomChoice(["A", "B", "C"]),
    gmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@gmail.com`,
    mobile: `017${Math.floor(10000000 + Math.random() * 90000000)}`,
    gender: gender,
    emergencyContact: `018${Math.floor(10000000 + Math.random() * 90000000)}`,
    relation: isMale ? "Father" : "Mother",
    tshirt: randomChoice(["M", "L", "XL"]),
    experience: Math.floor(Math.random() * 4),
    photo: isMale ? maleImg : femaleImg
  };
}

async function main() {
  const teams = [];
  
  for (let i = 0; i < 5; i++) {
    teams.push({
      team_name: `Team Elite ${Math.floor(100 + Math.random() * 900)}`,
      team_code: `TE-${Math.floor(1000 + Math.random() * 9000)}`,
      members: [generateMember(), generateMember(), generateMember()]
    });
  }

  const { data, error } = await supabase
    .from("registrations")
    .insert(teams)
    .select();

  if (error) {
    console.error("Error inserting data:", error.message);
  } else {
    console.log(`Successfully inserted ${data.length} teams.`);
  }
}

main();

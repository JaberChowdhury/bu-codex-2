import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const dummyData = {
    team_name: "Dummy Team",
    team_code: "DUMMY-1234",
    members: [
      {
        fullName: "John Doe",
        studentId: "202431070002",
        batch: "24",
        section: "A",
        gmail: "john@gmail.com",
        mobile: "01712345678",
        gender: "male",
        emergencyContact: "01812345678",
        relation: "Father",
        tshirt: "L",
        experience: 2,
        photo: "https://example.com/photo1.jpg"
      },
      {
        fullName: "Jane Smith",
        studentId: "202431070003",
        batch: "24",
        section: "B",
        gmail: "jane@gmail.com",
        mobile: "01712345679",
        gender: "female",
        emergencyContact: "01812345679",
        relation: "Mother",
        tshirt: "M",
        experience: 1,
        photo: "https://example.com/photo2.jpg"
      },
      {
        fullName: "Bob Wilson",
        studentId: "202431070004",
        batch: "24",
        section: "C",
        gmail: "bob@gmail.com",
        mobile: "01712345680",
        gender: "male",
        emergencyContact: "01812345680",
        relation: "Brother",
        tshirt: "XL",
        experience: 3,
        photo: "https://example.com/photo3.jpg"
      }
    ]
  };

  const { data, error } = await supabase
    .from("registrations")
    .insert([dummyData])
    .select();

  if (error) {
    console.error("Error inserting data:", error.message);
  } else {
    console.log("Successfully inserted dummy data:", data);
  }
}

main();

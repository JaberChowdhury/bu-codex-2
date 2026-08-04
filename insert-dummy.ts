import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const photoPath = path.join(__dirname, "dummy.jpg");
  const photoBuffer = fs.readFileSync(photoPath);

  const dummyData = {
    team_name: "Dummy Team with Image",
    team_code: "DUMMY-5678",
    department: "Department of Computer Science and Engineering (CSE)",
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
        photo: ""
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
        photo: ""
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
        photo: ""
      }
    ]
  };

  for (let i = 0; i < dummyData.members.length; i++) {
    const fileName = `${dummyData.team_code}-member${i + 1}-${Date.now()}.jpg`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("student_images")
      .upload(fileName, photoBuffer, {
        contentType: "image/jpeg",
        upsert: false
      });

    if (uploadError) {
      console.error(`Error uploading photo for member ${i + 1}:`, uploadError.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("student_images").getPublicUrl(fileName);
    dummyData.members[i].photo = publicUrlData.publicUrl;
    console.log(`Uploaded image for member ${i + 1}: ${publicUrlData.publicUrl}`);
  }

  const { data, error } = await supabase
    .from("registrations")
    .insert([dummyData])
    .select();

  if (error) {
    console.error("Error inserting data:", error.message);
  } else {
    console.log("Successfully inserted dummy data with images:", data);
  }
}

main();

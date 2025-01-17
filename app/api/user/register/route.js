import prisma from "@/libs/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
    let requestBody;
    try {
        requestBody = await req.json();
    } catch (error) {
        return new Response("Invalid JSON in request body", { status: 400 });
    }

    const { name, email, phoneNumber, password } = requestBody;

    // Validate request body
    if (!name || !email || !phoneNumber || !password) {
        return new Response("Missing required fields", { status: 400 });
    }

    const userRole = "FREE";
    try {
        // Check if a user already exists by email
        const existingUser = await prisma.user.findFirst({
            where: { email: email },
        });

        // User with this email already exists
        if (existingUser) {
            return new Response("User with this email already exists", {
                status: 200,
                statusText: "FAILED",
            });
        }

        // If the user does not exist, you can proceed with user creation

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = await prisma.user.create({
            data: {
                userRole: userRole,
                name,
                email,
                phoneNumber,
                password: hashedPassword,
            },
        });

        return new Response(JSON.stringify(newUser), {
            status: 201, // Created
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error processing the request:", error);

        return new Response("An error occurred", {
            status: 500, // Internal Server Error
        });
    }
}
import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

export const seedAdmin = async () => {
      try {
            console.log("***** Admin Seeding Started *****");
            const adminData = {
                  name: process.env.ADMIN_NAME,
                  email: process.env.ADMIN_EMAIL,
                  password: process.env.ADMIN_PASS,
                  role: UserRole.ADMIN,
            };
            console.log("***** Checking Admin Exist or Not");
            // check user exist on db or not 
            const existingUser = await prisma.user.findUnique({
                  where: {
                        email: adminData.email
                  }
            });

            if (existingUser) {
                  throw new Error("Admin already exists!")
            };

            const signUpAdmin = await fetch("http://localhost:3000/api/auth/sign-up/email", {
                  method: "POST",
                  headers: {
                        "content-type": "application/json"
                  },
                  body: JSON.stringify(adminData)
            });

            if (!signUpAdmin.ok) {
                  console.log("***** Admin Created *****");
                  await prisma.user.update({
                        where: {
                              email: adminData.email
                        },
                        data: {
                              emailVerified: true
                        }
                  });

                  console.log("***** Email Verification Status Updated");
            };
            console.log("***** SUCCESS *****");
      } catch (err) {
            console.log(err);
      }
};
seedAdmin();
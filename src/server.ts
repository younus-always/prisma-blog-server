import { Server } from "http";
import { prisma } from "./lib/prisma";
import app from "./app";

const port = process.env.PORT || 5000;
let server: Server;

const main = async () => {
      try {
            await prisma.$connect();
            console.log("Connected to the database successfully");

            server = app.listen(port, () => {
                  console.log(`Server is running on http://localhost:${port}`);
            });
      } catch (err) {
            console.log("An error occurred:", err);
            await prisma.$disconnect();
            process.exit(1);
      }
};
main();
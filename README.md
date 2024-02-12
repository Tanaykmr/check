# TaskMaster
Follow the given steps to set up the project:
1. create a .env.local in config in server
```
cd server
mkdir config
cd config
touch .env.local
```
2. In .env.local, add 2 variables named ```JWT_SECRET```(enter a string of your choice) and ```MONGOOSE_URL``` and add your MongoDB connection string here.
3. 
4. while in server, install all dependencies using ```npm i```
5. Your backend is now ready, to set up the frontend, navigate to client and create a file named ```.env````
```
cd client
touch .env
```
5. in .env, create a variable named ```VITE_BASE_URL``` and set it's value as ```http://localhost:3000```
6. Back in client, execute ```npm i``` to install all dependencies
7. Execute ```npm run dev``` in client to start the frontend
8. Execute ```tsc``` in server to compile all the typescript files
9. Then execute ```node dist/``` in server to start the backend
10. You are now ready to go!



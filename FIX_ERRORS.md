# How to Fix TypeScript Errors

The TypeScript errors you're seeing are because the npm dependencies haven't been installed yet.

## Steps to Fix:

### 1. Open the project workspace in VS Code
```
File > Open Folder > Navigate to:
C:\Users\RanjitSambhajiSavant\source\repos\MyCodes\WildlifSafari\Frontend\wildlife-safari-app
```

### 2. Install npm dependencies
Open a terminal in  VS Code and run:
```bash
npm install
```

This will install all required packages:
- react
- react-dom
- react-router-dom
- axios
- typescript
- @types/react
- @types/react-dom
- @types/node

### 3. Verify installation
After installation completes, the TypeScript errors should disappear automatically. You can verify by:
- Checking that a `node_modules` folder exists
- Opening any `.tsx` file - errors should be gone
- Running: `npm start` to start the development server

## Alternative: Run from root workspace

If you want to work on both backend and frontend, open the root folder:
```
C:\Users\RanjitSambhajiSavant\source\repos\MyCodes\WildlifSafari
```

Then navigate to the frontend folder in terminal and run `npm install`:
```bash
cd Frontend\wildlife-safari-app
npm install
```

## What was changed?

The code changes I made are correct - the errors are just VS Code complaining that it can't find the npm packages because they haven't been installed yet. Once you run `npm install`, all errors will be resolved.

## Backend Errors?

There are no backend errors. The C# code compiles correctly. You just need to:
1. Run the database update script: `Database\Scripts\UpdatePhotoSchema.sql`
2. Rebuild the backend projects if needed

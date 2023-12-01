import fsPromises from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server'

const dataFilePath = path.join(process.cwd(), 'db.json');

export async function POST(request) {
    const req = await request.json()
    const jsonData = await fsPromises.readFile(dataFilePath);
    const objectData = JSON.parse(jsonData);
    objectData.openAIKey = req.id
    await fsPromises.writeFile(dataFilePath, JSON.stringify(objectData));
    return NextResponse.json(objectData)
  
}


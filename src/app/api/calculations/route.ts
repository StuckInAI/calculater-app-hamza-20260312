import { NextRequest, NextResponse } from 'next/server';
import 'reflect-metadata';
import { getDataSource } from '@/lib/database';
import { Calculation } from '@/entities/Calculation';

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const repo = dataSource.getRepository(Calculation);
    const calculations = await repo.find({
      order: { createdAt: 'DESC' },
    });
    return NextResponse.json(calculations);
  } catch (error) {
    console.error('GET /api/calculations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calculations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expression, result } = body;

    if (!expression || result === undefined || result === null) {
      return NextResponse.json(
        { error: 'expression and result are required' },
        { status: 400 }
      );
    }

    const dataSource = await getDataSource();
    const repo = dataSource.getRepository(Calculation);

    const calculation = repo.create({
      expression: String(expression),
      result: String(result),
    });

    const saved = await repo.save(calculation);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('POST /api/calculations error:', error);
    return NextResponse.json(
      { error: 'Failed to save calculation' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const dataSource = await getDataSource();
    const repo = dataSource.getRepository(Calculation);
    await repo.clear();
    return NextResponse.json({ message: 'History cleared successfully' });
  } catch (error) {
    console.error('DELETE /api/calculations error:', error);
    return NextResponse.json(
      { error: 'Failed to clear calculations' },
      { status: 500 }
    );
  }
}

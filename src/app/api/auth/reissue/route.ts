import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

function joinUrl(base: string, path: string) {
  const b = base.replace(/\/+$/, '');
  const p = path.replace(/^\/+/, '');
  return `${b}/${p}`;
}

export async function PATCH(request: NextRequest) {
  const refreshToken =
    request.headers.get('refreshtoken') ?? request.headers.get('RefreshToken');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return NextResponse.json({ error: 'API URL missing' }, { status: 500 });
  }

  if (!refreshToken) {
    return NextResponse.json(
      { error: 'Refresh token missing' },
      { status: 400 },
    );
  }

  try {
    const target = joinUrl(apiUrl, 'auth/reissue');
    const response = await axios.patch(target, null, {
      headers: { refreshtoken: refreshToken },
      timeout: 5000,
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const ax = axios.isAxiosError(error) ? error : undefined;
    return NextResponse.json(
      { error: ax?.response?.data ?? 'Reissue failed' },
      { status: ax?.response?.status ?? 500 },
    );
  }
}

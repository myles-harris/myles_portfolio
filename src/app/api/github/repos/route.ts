import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const username = process.env.GITHUB_USERNAME || 'mylesharris';
    
    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      repos: data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        updated_at: repo.updated_at,
        html_url: repo.html_url
      }))
    });
  } catch (error) {
    console.error('GitHub repos error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
} 
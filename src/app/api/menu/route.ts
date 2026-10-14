import { menuCatalog } from '@/data/menu';

export function GET() {
  return Response.json(menuCatalog);
}

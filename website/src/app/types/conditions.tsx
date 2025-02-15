import { Category } from "./category";

enum operations{
    AND, OR
}

class Query{
    public op: operations| null = null;
    public left : Query | Category | null = null;
    public right : Query | Category | null = null;
}

export {Query, operations};
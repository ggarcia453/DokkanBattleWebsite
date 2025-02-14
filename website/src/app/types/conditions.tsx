import { Category } from "./category";

enum operations{
    And, Or
}

class Query{
    public op: operations| null = null;
    public left : Query | Category | null = null;
    public right : Query | Category | null = null;
}

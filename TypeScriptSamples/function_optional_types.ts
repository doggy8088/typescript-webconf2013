class Article
{
    id: number;
    subject: string;
    content: string;
    clicks: number;
    createdOn: Date;

    constructor(id: number, subject: string, content?, clicks?, createdOn?)
    {

    }
}

function get_article(id: number, is_older_then_7_days?: number): Article
{
    return new Article(1, 'TEST TITLE');
}

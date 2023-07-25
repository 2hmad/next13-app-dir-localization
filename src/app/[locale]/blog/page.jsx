import { getDictionary } from "@/dictionaries";

const BlogPage = async ({ params: { locale } }) => {
  const t = await getDictionary(locale);

  return <h1>{t["general"]["blog"]}</h1>;
};

export default BlogPage;

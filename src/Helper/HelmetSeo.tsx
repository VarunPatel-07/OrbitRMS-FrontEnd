import { Helmet } from "react-helmet";
interface SeoPropsInterface {
  Title?: string;
  Content?: string;
}

function HelmetSeo(prop: SeoPropsInterface) {
  const { Title, Content } = prop;
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{Title || "OrbitRMS"}</title>
      <meta name="description" content={Content} />
      <link rel="canonical" href="http://mysite.com/example" />
    </Helmet>
  );
}

export default HelmetSeo;

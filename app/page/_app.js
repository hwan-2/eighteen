import { SessionProvider } from 'next-auth/react';
import Layout from "../layout.js";

function MyApp({ Component, pageProps }) {
    return (
      <SessionProvider session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    );
  }

export default MyApp;
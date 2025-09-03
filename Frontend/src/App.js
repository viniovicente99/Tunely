import Container from "./components/Container/Index";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ArtistSearch from "./components/ArtistSearch";

function App() {
  return (
    <> 
    <Header/>
    <Container>
    <ArtistSearch/>
    </Container>
    <Footer />
      </>
  );
}

export default App;

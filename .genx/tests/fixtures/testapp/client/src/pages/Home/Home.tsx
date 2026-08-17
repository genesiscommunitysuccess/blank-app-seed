import { EntityManagement } from '@genesislcap/foundation-entity-management/react';
import './Home.css';

const Home = () => {
  return (
    <section className="home-page">
      <EntityManagement prefix="rapid" resourceName="ALL_TRADES" createEvent="EVENT_TRADE_INSERT" />
    </section>
  );
};

export default Home;

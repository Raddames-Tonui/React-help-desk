import { Link } from "@tanstack/react-router";


const Home = () => {

  return (
    <section>
      <div className="dynamic-forms">
        <Link to="/dynamicforms/contactform">EXAMPLE 1: SIMPLE CONTACT FORM</Link>
        <Link to="/dynamicforms/user-registration">EXAMPLE2: USER REGISTRATION WITH CONDITIONAL FIELDS</Link>
        <Link to="/dynamicforms/agent/update">EXAMPLE 3: AGENT UPDATE FORM</Link>
        <Link to="/dynamicforms/product/form">EXAMPLE 4: PRODUCT FORM WITH COMPLEX CONDITIONS</Link>
        <Link to="/dynamicforms/address/form">EXAMPLE 5: ADDRESS FORM WITH COUNTRY-DEPENDENT FIELDS</Link>
        <Link to="/dynamicforms/job/application/form">EXAMPLE 6: JOB APPLICATION FORM</Link>
        <Link to="/dynamicforms/multi-condition/form">EXAMPLE 7: MULTI-CONDITION FORM</Link>
      </div>
    </section>
  );
};

export default Home;

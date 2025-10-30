import { Link } from "@tanstack/react-router";


const Home = () => {

  return (
    <section>
      <div className="dynamic-forms">
        <Link to="/dynamicforms/contactform">SIMPLE CONTACT FORM</Link>
        <Link to="/dynamicforms/user-registration">USER REGISTRATION WITH CONDITIONAL FIELDS</Link>
        <Link to="/dynamicforms/agent/update">AGENT UPDATE FORM</Link>
        <Link to="/dynamicforms/product/form">PRODUCT FORM WITH COMPLEX CONDITIONS</Link>
        <Link to="/dynamicforms/address/form">ADDRESS FORM WITH COUNTRY-DEPENDENT FIELDS</Link>
        <Link to="/dynamicforms/job/application/form">JOB APPLICATION FORM</Link>
        <Link to="/dynamicforms/multi-condition/form">MULTI-CONDITION FORM</Link>
      </div>
    </section>
  );
};

export default Home;

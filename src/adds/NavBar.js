import React from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();

    return (
        <nav class="navbar navbar-expand-sm bg-dark navbar-light">
  <div class="container-fluid">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link active" href="#">Active</a>
      </li>
     <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul>
  </div>

  
<nav class="navbar navbar-expand-sm bg-dark navbar-dark">fffffffffffffff</nav>
<nav class="navbar navbar-expand-sm bg-primary navbar-dark">ffffffffff</nav>
</nav>


    );
};

export default NavBar;
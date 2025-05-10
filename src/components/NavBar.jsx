import React from "react";
import { Nav, ListGroup, ListGroupItem, NavLink } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./NavBar.css";

export const Navbar = () => {
  const data = useSelector((state) => state.searchQuery.searchQuery);
  // console.log(data);
  if (!data || !data.owner || !data.owner.login || !data.name) {
    return null;
  }
  const userLink = `https://github.com/${data.owner.login}/`;
  const repoLink = `https://github.com/${data.owner.login}/${data.name}/`;
  return (
    <Nav className="mb-4 px-4">
      <ListGroup horizontal className="repo-list-group">
        <ListGroupItem className="repo-item">
          <NavLink href={userLink} className="repo-link">
            {data.owner.login}
          </NavLink>
        </ListGroupItem>
        <ListGroupItem className="repo-item">
          <NavLink href={repoLink} className="repo-link">
            {data.name}
          </NavLink>
        </ListGroupItem>
        <ListGroupItem className="repo-item repo-stars">{data.stargazers_count}</ListGroupItem>
      </ListGroup>
    </Nav>
  );
};

export default Navbar;

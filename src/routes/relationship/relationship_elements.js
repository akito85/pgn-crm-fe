import React from "react";
import RelationshipPage from "../../app/pages/relationship/RelationshipPage";
import CreateUpdateRelationshipPage from "../../app/pages/relationship/CreateUpdateRelationshipPage";
import RelationshipDetailPage from "../../app/pages/relationship/RelationshipDetailPage";

export const RELATIONSHIP_ELEMENTS = {
  VIEW_RELATIONSHIP_PAGE:   <RelationshipPage />,
  CREATE_RELATIONSHIP_PAGE: <CreateUpdateRelationshipPage />,
  UPDATE_RELATIONSHIP_PAGE: <CreateUpdateRelationshipPage />,
  DETAIL_RELATIONSHIP_PAGE: <RelationshipDetailPage />,
};

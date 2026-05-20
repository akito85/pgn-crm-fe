import ApprovalHierarchySection from '../../shared/ApprovalHierarchySection';

const Approval = (props) => (
  <ApprovalHierarchySection
    {...props}
    tableIdPrefix="service-agreement-create-approval"
  />
);

export default Approval;

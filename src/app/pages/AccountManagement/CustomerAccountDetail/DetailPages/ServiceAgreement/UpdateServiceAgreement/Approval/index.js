import ApprovalHierarchySection from '../../shared/ApprovalHierarchySection';

const Approval = (props) => (
  <ApprovalHierarchySection
    {...props}
    tableIdPrefix="service-agreement-update-approval"
  />
);

export default Approval;

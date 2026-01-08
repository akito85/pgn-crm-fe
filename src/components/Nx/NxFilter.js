import React, { useEffect, useCallback, useMemo } from "react";
import { Form, Select, Tooltip, Badge } from "antd";
import ButtonComponent from "../ButtonComponent";
import InputComponent from "../InputComponent";
import SelectComponent from "../SelectComponent";
import SVGIcon from "../../assets/Icon/index";
import { requiredMessage } from "../../utils";

/**
 * NxFilter - Advanced Filter Component
 *
 * A robust, reusable filtering component for building dynamic query filters.
 * Options are loaded from Redux global types via API.
 *
 * @component
 * @example
 * // Usage with Redux global types
 * const reduxState = useSelector((state) => state.customerAccount);
 *
 * <NxFilter
 *   form={formInstance}
 *   formFieldName="query"
 *   onCancel={handleCancel}
 *   dispatch={dispatch}
 *   getColumnApi={getGlobalSearchColumn}
 *   getOperatorApi={getGlobalSearchOperator}
 *   getConditionApi={getGlobalSearchCondition}
 *   reduxState={reduxState}
 *   maxFilters={5}
 *   loading={loading}
 * />
 */
const NxFilter = ({
  // Form configuration
  form,
  formFieldName = "query",
  formId = "nxFilterForm",

  // Filter callbacks
  onFinish = () => {},
  onCancel = () => {},
  onAdd = () => {},
  onDelete = () => {},

  // Redux integration
  dispatch,
  getColumnApi,
  getOperatorApi,
  getConditionApi,
  reduxState,

  // Customization
  maxFilters = 5,
  minFilters = 0,
  showAddButton = true,
  showCancelButton = true,
  showSubmitButton = true,
  addButtonText = "Add",
  cancelButtonText = "Cancel",
  submitButtonText = "Save",

  // Field labels
  conditionLabel = "Condition",
  columnLabel = "Column",
  operatorLabel = "Operator",
  valueLabel = "Value",

  // Validation
  requireAllFields = true,
  disableFirstCondition = true,

  // Value field customization
  valueInputType = "text", // 'text', 'number', 'select', 'custom'
  valueInputProps = {},
  customValueRenderer = null,

  // Styling
  className = "",
  layout = "vertical",

  // Loading states
  loading = false,

  // Badge configuration
  showBadge = false,
  badgeCount = 0,

  // For get thunk API that needs account ID
  accountId,
}) => {
  // Get options from Redux state (loaded from global type APIs)
  const options = useMemo(() => ({
    conditions: reduxState?.data_globalTypeCondition || [],
    operators: reduxState?.data_globalTypeOperator || [],
    columns: reduxState?.data_globalTypeColumn || [],
  }), [reduxState]);

  // Fetch options from APIs on mount
  useEffect(() => {
    if (dispatch && getColumnApi && getOperatorApi && getConditionApi) {
      dispatch(getColumnApi({ accountId }));
      dispatch(getConditionApi({ accountId }));
      dispatch(getOperatorApi({ accountId }));
    }
  }, [dispatch, getColumnApi, getOperatorApi, getConditionApi]);

  /**
   * Handle first query condition - ensure first item always has default condition
   */
  const handleFirstQuery = useCallback(() => {
    if (!form || !disableFirstCondition) return;

    const currentValues = form.getFieldValue(formFieldName);

    if (currentValues && currentValues.length > 0) {
      const updatedValues = [...currentValues];
      // Set first condition to 0 or first available option
      const defaultCondition = options.conditions?.[0]?.id || 0;
      updatedValues[0] = { ...updatedValues[0], condition: defaultCondition };

      form.setFieldsValue({
        [formFieldName]: updatedValues,
      });
    }
  }, [form, formFieldName, disableFirstCondition, options.conditions]);

  /**
   * Handle add filter
   */
  const handleAdd = useCallback((add) => {
    add();
    handleFirstQuery();
    onAdd();
  }, [handleFirstQuery, onAdd]);

  /**
   * Handle delete filter
   */
  const handleDelete = useCallback((remove, name, index) => {
    remove(name);
    handleFirstQuery();
    onDelete(index);
  }, [handleFirstQuery, onDelete]);

  /**
   * Render value input based on type
   */
  const renderValueInput = useCallback((name, restField) => {
    if (customValueRenderer) {
      return customValueRenderer(name, restField);
    }

    switch (valueInputType) {
      case 'number':
        return (
          <InputComponent
            type="number"
            placeholder={`Enter ${valueLabel}`}
            {...valueInputProps}
          />
        );

      case 'select':
        return (
          <SelectComponent
            placeholder={`Select ${valueLabel}`}
            {...valueInputProps}
          >
            {(valueInputProps.options || []).map((opt) => (
              <Select.Option key={opt.id || opt.value} value={opt.id || opt.value}>
                {opt.label || opt.value}
              </Select.Option>
            ))}
          </SelectComponent>
        );

      case 'text':
      default:
        return (
          <InputComponent
            placeholder={`Enter ${valueLabel}`}
            {...valueInputProps}
          />
        );
    }
  }, [customValueRenderer, valueInputType, valueInputProps, valueLabel]);

  return (
    <div className={`nx-filter-container ${className}`}>
      <Form.List name={formFieldName}>
        {(fields, { add, remove }) => (
          <>
            {/* Render filter rows */}
            {fields.map(({ key, name, ...restField }, index) => (
              <div key={key} className="flex flex-row gap-2 mb-4">
                <div className="w-full">
                  <div className="w-full grid grid-cols-4 gap-2">
                    {/* Condition Select */}
                    <Form.Item
                      {...restField}
                      label={conditionLabel}
                      name={[name, "condition"]}
                      rules={[
                        {
                          required: requireAllFields,
                          message: requiredMessage(conditionLabel),
                        },
                      ]}
                    >
                      <Select
                        placeholder={`Select ${conditionLabel}`}
                        disabled={disableFirstCondition && index === 0}
                        loading={loading}
                      >
                        {(options.conditions || []).map((data) => (
                          <Select.Option key={data.id} value={data.id}>
                            {data.value}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {/* Column Select */}
                    <Form.Item
                      {...restField}
                      label={columnLabel}
                      name={[name, "column"]}
                      rules={[
                        {
                          required: requireAllFields,
                          message: requiredMessage(columnLabel),
                        },
                      ]}
                    >
                      <Select
                        placeholder={`Select ${columnLabel}`}
                        loading={loading}
                      >
                        {(options.columns || []).map((data) => (
                          <Select.Option key={data.id} value={data.id}>
                            {data.value}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {/* Operator Select */}
                    <Form.Item
                      {...restField}
                      label={operatorLabel}
                      name={[name, "operator"]}
                      rules={[
                        {
                          required: requireAllFields,
                          message: requiredMessage(operatorLabel),
                        },
                      ]}
                    >
                      <Select
                        placeholder={`Select ${operatorLabel}`}
                        loading={loading}
                      >
                        {(options.operators || []).map((data) => (
                          <Select.Option key={data.id} value={data.id}>
                            {data.value}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {/* Value Input */}
                    <Form.Item
                      {...restField}
                      label={valueLabel}
                      name={[name, "value"]}
                      rules={[
                        {
                          required: requireAllFields,
                          message: requiredMessage(valueLabel),
                        },
                      ]}
                    >
                      {renderValueInput(name, restField)}
                    </Form.Item>
                  </div>
                </div>

                {/* Delete Button */}
                {(fields.length > minFilters) && (
                  <div className="pt-8 pl-2">
                    <Tooltip title="Delete">
                      <SVGIcon
                        name="IconDelete"
                        color="#D90000"
                        width={24}
                        onClick={() => handleDelete(remove, name, index)}
                        style={{ cursor: "pointer" }}
                      />
                    </Tooltip>
                  </div>
                )}
              </div>
            ))}

            {/* Footer Actions */}
            <div className="w-full flex justify-between mt-5">
              {/* Add Button */}
              <div>
                {showAddButton && (
                  <Badge count={showBadge ? badgeCount : 0}>
                    <ButtonComponent
                      type="submit"
                      onClick={() => handleAdd(add)}
                      disabled={fields.length >= maxFilters || loading}
                    >
                      {addButtonText}
                    </ButtonComponent>
                  </Badge>
                )}
              </div>

              {/* Cancel and Submit Buttons */}
              <div className="flex gap-3">
                {showCancelButton && (
                  <Form.Item>
                    <ButtonComponent
                      type="default"
                      onClick={onCancel}
                      disabled={loading}
                    >
                      {cancelButtonText}
                    </ButtonComponent>
                  </Form.Item>
                )}
                {showSubmitButton && (
                  <Form.Item>
                    <ButtonComponent
                      type="submit"
                      htmlType="submit"
                      form={formId}
                      disabled={loading}
                    >
                      {submitButtonText}
                    </ButtonComponent>
                  </Form.Item>
                )}
              </div>
            </div>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default NxFilter;

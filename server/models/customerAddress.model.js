import queryAsync from "../lib/db.js";

const customerAddress = {
  create: async (addressData) => {
    try {
      const result = await queryAsync(
        "INSERT INTO `customer_address`(`customer_id`, `first_name`, `last_name`, `company`, `company_id`, `tax_id`, `address_1`, `address_2`, `city`, `postcode`, `country`, `state`, `create_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          addressData.customer_id,
          addressData.first_name,
          addressData.last_name,
          addressData.company,
          addressData.company_id,
          addressData.tax_id,
          addressData.address_1,
          addressData.address_2,
          addressData.city,
          addressData.postcode,
          addressData.country,
          addressData.state,
          addressData.create_at,
        ]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  update: async (addressData) => {
    try {
      const result = await queryAsync(
        "UPDATE `customer_address` SET `first_name`=?, `last_name`=?, `company`=?, `company_id`=?, `tax_id`=?, `address_1`=?, `address_2`=?, `city`=?, `postcode`=?, `country`=?, `state`=?,  `update_at`=?  WHERE `customer_address_id`=?",
        [
          addressData.first_name,
          addressData.last_name,
          addressData.company,
          addressData.company_id,
          addressData.tax_id,
          addressData.address_1,
          addressData.address_2,
          addressData.city,
          addressData.postcode,
          addressData.country,
          addressData.state,
          addressData.update_at,
          addressData.customer_address_id,
        ]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  deleteMultipleByCustomerIds: async (customerIds) => {
    try {
      if (!Array.isArray(customerIds) || customerIds.length === 0) {
        throw new Error("Invalid or empty 'customerIds' array.");
      }

      const query = `
        DELETE FROM customer_address
        WHERE customer_id IN (?);
      `;

      const result = await queryAsync(query, [customerIds]);

      return result.affectedRows > 0 ? customerIds : [];
    } catch (error) {
      throw error;
    }
  },
};

export default customerAddress;

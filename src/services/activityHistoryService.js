const ActivityHistory = require('../models/activityHistory');


const getAllActivityHistoryService = async (limit, page, filterType, filterValue, sortBy, sortOrder) => {
  try {
    let query = {};
    console.log("check service", { limit, page, filterType, filterValue, sortBy, sortOrder })
    // Áp dụng bộ lọc nếu có filterValue
    if (filterValue !== null && filterType === "createdAt") {
      query[filterType] = filterValue;
    }

    // Tạo truy vấn có filter
    let activityHistoryQuery = ActivityHistory.find(query);

    // Sắp xếp sau khi đã có kết quả tìm kiếm, nếu không sẽ mặc định theo thời gian mới nhất
    let sortOption = {};

    sortOrder = sortOrder === 'desc' ? -1 : 1;
    sortOption[sortBy] = sortOrder;
    activityHistoryQuery = activityHistoryQuery.sort(sortOption);

    // Phân trang
    let offset = (page - 1) * limit;
    activityHistoryQuery = activityHistoryQuery.skip(offset).limit(limit);

    // Lấy dữ liệu
    const data = await activityHistoryQuery.exec();

    // Tong so row
    const totalRows = await ActivityHistory.countDocuments(query).exec();

    return { data, totalRows };
  } catch (error) {
    console.log(error);
    return { data: [], totalRows: 0 };
  }
};

const createActivityHistoryService = async (data) => {
  try {
    let res = await ActivityHistory.create({
      device: data.device,
      action: data.action,
    })
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
}


const deleteActivityHistoryService = async (id) => {
  try {
    let result = await ActivityHistory.deleteById({ _id: id });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  createActivityHistoryService, getAllActivityHistoryService, deleteActivityHistoryService
}
const SensorData = require('../models/sensorData')

const getAllSensorDataService = async (limit, page, filterType, filterValue, sortBy, sortOrder) => {
  try {
    let query = {};
    console.log("check service", { limit, page, filterType, filterValue, sortBy, sortOrder })
    // Áp dụng bộ lọc nếu có filterValue
    if (filterValue !== null) {
      if (filterType === "all") {
        query["$or"] = [
          { temperature: filterValue },
          { humidity: filterValue },
          { light: filterValue }
        ];
      } else {
        query[filterType] = filterValue;
      }
    }

    // Tạo truy vấn có filter
    let sensorDataQuery = SensorData.find(query);

    // Sắp xếp sau khi đã có kết quả tìm kiếm, nếu không sẽ mặc định theo thời gian mới nhất
    let sortOption = {};

    sortOrder = sortOrder === 'desc' ? -1 : 1;
    sortOption[sortBy] = sortOrder;
    sensorDataQuery = sensorDataQuery.sort(sortOption);

    // Phân trang
    let offset = (page - 1) * limit;
    sensorDataQuery = sensorDataQuery.skip(offset).limit(limit);

    // Lấy dữ liệu
    const data = await sensorDataQuery.exec();

    // Tong so row
    const totalRows = await SensorData.countDocuments(query).exec();

    return { data, totalRows };
  } catch (error) {
    console.log(error);
    return { data: [], totalRows: 0 };
  }
};



const createSensorDataService = async (data) => {
  try {
    let res = await SensorData.create({
      temperature: data.temperature,
      humidity: data.humidity,
      light: data.light
    })
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
}


const deleteSensorDataService = async (id) => {
  try {
    let result = await SensorData.deleteById({ _id: id });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  createSensorDataService, getAllSensorDataService, deleteSensorDataService
}
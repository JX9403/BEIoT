const { getAllActivityHistoryService, createActivityHistoryService, deleteActivityHistoryService } = require("../services/activityHistoryService");

const postCreateActivityHistory = async (req, res) => {
  let { device, action } = req.body;

  let reqActivityHistory = {
    device, action
  }

  let result = await createActivityHistoryService(reqActivityHistory);

  return res.status(200).json({
    EC: 0,
    data: result
  })
}

const getAllActivityHistory = async (req, res) => {
  try {
    // Lấy limit, page, và các tham số lọc từ request query
    let limit = req.query.limit || 10;  // Mặc định 10 bản ghi mỗi trang
    let page = req.query.page || 1;      // Mặc định trang đầu tiên
    let filterType = req.query.filterType || 'createdAt';  // Loại filter
    let filterValue = req.query.filterValue || null;        // Giá trị filter
    let sortBy = req.query.sortBy || 'createdAt';     // Sắp xếp theo trường createdAt mặc định
    let sortOrder = req.query.sortOrder || 'desc';    // Mặc định sắp xếp giảm dần (desc)

    // console.log("check sortOrderReq", req.query.sortOrder)
    // console.log({ limit, page, filterType, filterValue, sortBy, sortOrder })

    // Lấy dữ liệu từ service
    const { data, totalRows } = await getAllActivityHistoryService(
      limit,
      page,
      filterType,
      filterValue,
      sortBy,
      sortOrder
    );

    // Tính tổng số trang
    const totalPages = Math.ceil(totalRows / limit);

    // Trả về dữ liệu cùng với tổng số row và số trang
    return res.status(200).json({
      EC: 0,
      data: data,
      totalRows: totalRows,  // Tổng số row trong cơ sở dữ liệu
      totalPages: totalPages // Tổng số trang
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EC: 1,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại!'
    });
  }
}


const deleteActivityHistory = async (req, res) => {
  let id = req.body.id;
  // console.log(id)
  let result = await deleteActivityHistoryService(id);

  return res.status(200).json({
    EC: 0,
    data: result
  })
}

module.exports = {
  getAllActivityHistory, postCreateActivityHistory, deleteActivityHistory
}
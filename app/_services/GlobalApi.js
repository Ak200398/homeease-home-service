const { gql, default: request } = require("graphql-request")

const MASTER_URL='https://api-ap-south-1.hygraph.com/v2/'+process.env.NEXT_PUBLIC_MASTER_URL_KEY+'/master'

const getCategory = async ()=>{
    const query = gql`
    query Category {
            categories {
                id
                name
                icon {
                    url
                }
            }
        }
        `

    try {
        const result = await request(MASTER_URL, query);
        return result;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error; // Rethrow the error after logging
    }
};

const getAllBusinessList = async () => {
    const query = gql`
        query BusinessList {
            businessLists {
                about
                address
                category {
                    name
                }
                contactPerson
                email
                images {
                    url
                }
                id
                name
            }
        }
    `;

    try {
        const result = await request(MASTER_URL, query);
        return result;
    } catch (error) {
        console.error("Error fetching all business lists:", error);
        throw error;
    }
};

const getBusinessByCategory = async (category) => {
    const query = gql`
        query MyQuery {
            businessLists(where: { category: { name: "${category}" } }) {
                about
                address
                category {
                    name
                }
                contactPerson
                email
                id
                name
                images {
                    url
                }
            }
        }
    `;

    try {
        const result = await request(MASTER_URL, query);
        return result;
    } catch (error) {
        console.error(`Error fetching businesses by category "${category}":`, error);
        throw error;
    }
};

const getBusinessById = async (id) => {
    const query = gql`
        query GetBusinessById {
            businessList(where: { id: "${id}" }) {
                about
                address
                category {
                    name
                }
                contactPerson
                email
                id
                name
                images {
                    url
                }
            }
        }
    `;

    try {
        const result = await request(MASTER_URL, query);
        return result;
    } catch (error) {
        console.error(`Error fetching business by ID "${id}":`, error);
        throw error;
    }
};

const createNewBooking = async (businessId, date, time, userEmail, userName) => {
    const mutationQuery = gql`
        mutation CreateBooking {
            createBooking(
                data: {
                    bookingStatus: booked,
                    businessList: { connect: { id: "${businessId}" } },
                    date: "${date}",
                    time: "${time}",
                    userEmail: "${userEmail}",
                    userName: "${userName}"
                }
            ) {
                id
            }
            publishManyBookingsConnection(to: PUBLISHED) {
                aggregate {
                    count
                }
            }
        }
    `;

    const headers = {
        Authorization: `Bearer ${process.env.HYGRAPH_PAT}`,
      };

    try {
        const result = await request(MASTER_URL, mutationQuery, headers);
        return result;
    } catch (error) {
        console.error("Error creating new booking:", error);
        throw error;
    }
};

const businessBookedSlot = async (businessId, date) => {
    const query = gql`
        query BusinessBookedSlot {
            bookings(where: { businessList: { id: "${businessId}" }, date: "${date}" }) {
                date
                time
            }
        }
    `;

    try {
        const result = await request(MASTER_URL, query);
        return result;
    } catch (error) {
        console.error(`Error fetching booked slots for business ID "${businessId}" on date "${date}":`, error);
        throw error;
    }
};

const getUserBookingHistory = async (userEmail) => {
  const query = gql`
      query GetUserBookingHistory {
          bookings(where: { userEmail: "${userEmail}" }, orderBy: publishedAt_DESC) {
              businessList {
                  name
                  images {
                      url
                  }
                  contactPerson
                  address
              }
              date
              time
              id
          }
      }
  `;

  try {
      const result = await request(MASTER_URL, query);
      return result;
  } catch (error) {
      console.error(`Error fetching booking history for user "${userEmail}":`, error);
      throw error;
  }
};

const deleteBooking = async (bookingId) => {
  const mutationQuery = gql`
      mutation DeleteBooking {
          updateBooking(
              data: { userName: "RRRS" } // Update this as needed
              where: { id: "${bookingId}" }
          ) {
              id
          }
      }
  `;

  try {
      const result = await request(MASTER_URL, mutationQuery);
      return result;
  } catch (error) {
      console.error(`Error deleting booking with ID "${bookingId}":`, error);
      throw error;
  }
};

export default {
  getCategory,
  getAllBusinessList,
  getBusinessByCategory,
  getBusinessById,
  createNewBooking,
  businessBookedSlot,
  getUserBookingHistory,
  deleteBooking,
};
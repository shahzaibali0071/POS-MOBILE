using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace POS_MOBILE
{
    public partial class PURCHASES : Form
    {
        string ConnectionString = "Data Source=shahzaib-ali;Initial Catalog=mobile_shop;Integrated Security=True";
        SqlConnection connect;
        string getproduct, getprice, getid, getstock, sp, CATEGORY;
        string[] listarr;
        public PURCHASES()
        {
            InitializeComponent();
        }

        private void PURCHASES_Load(object sender, EventArgs e)
        {
            fetchproduct();
        }
        void fetchproduct()
        {
            CATcomboBox.Items.Clear();
            connect = new SqlConnection(ConnectionString);
            SqlCommand cmddb = new SqlCommand("SELECT SHOP FROM SUPPLIER", connect);
            SqlDataReader reader;
            try
            {
                connect.Open();
                reader = cmddb.ExecuteReader();
                while (reader.Read())
                {
                    string str = reader.GetString(0);
                    CATcomboBox.Items.Add(str);
                }
                connect.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }

        }
    }
}

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
    public partial class REPAIRING : Form
    {
        string ConnectionString = "Data Source=shahzaib-ali;Initial Catalog=mobile_shop;Integrated Security=True";
        SqlConnection conn;
        string showmessage = "";
        string querry = "";
        string value;

        public REPAIRING()
        {
            InitializeComponent();
        }

        private void REPAIRING_Load(object sender, EventArgs e)
        {
            getID();
            dgvpop();
            get_ITEM();

        }

        private void databaseCRUD(string savequerry, string message)
        {
            try
            {
                conn = new SqlConnection(ConnectionString);
                SqlCommand cmd = null;
                conn.Open();
                cmd = new SqlCommand(savequerry, conn);
                cmd.CommandType = CommandType.Text;
                cmd.ExecuteNonQuery();
                conn.Close();
                MessageBox.Show("Successfully " + message);
                clear_valu();
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
            }
        }

        private void clear_valu()
        {
            ITEMcombo.SelectedIndex = -1;
            nametxt.Text = "";
            modeltxt.Text = "";
            QUALITYcombo.SelectedIndex = -1;
            QUANTITYTXT.Text = "";
            UNITCOMBO.SelectedIndex = -1;
            SELPRICETXT.Text = "";
            COSTPRICETXT.Text = "";
            //getID();
        }

        private void getID()
        {
            try
            {

                SqlConnection connect = new SqlConnection(ConnectionString);
                SqlDataAdapter sda = new SqlDataAdapter("Select ID from repair order by ID desc", connect);
                DataSet ds = new DataSet();
                sda.Fill(ds);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    REP_ID.Text = (Convert.ToInt32(ds.Tables[0].Rows[0][0].ToString()) + 1).ToString();
                }
                else
                {
                    REP_ID.Text = "5000";
                }


                connect.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }

        }

        private void dgvpop()
        {
            conn = new SqlConnection(ConnectionString);
            conn.Open();

            SqlDataAdapter adapter = new SqlDataAdapter("Select * from repair order by ID desc", conn);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            repdgv.DataSource = dt;

            conn.Close();
        }

        private void SELPRICETXT_TextChanged(object sender, EventArgs e)
        {
            if (SELPRICETXT.Text.Length > 0)
            {
                PROFIT.Text = (Convert.ToInt32(SELPRICETXT.Text) - Convert.ToInt32(COSTPRICETXT.Text)).ToString();
            }
            else
            {
                SELPRICETXT.Focus();
                PROFIT.Text = "000";
            }
        }

        private void repdgv_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (repdgv.CurrentRow.IsNewRow)
            {
                getID();
                ITEMcombo.SelectedIndex = 0;
                nametxt.Text = "";
                modeltxt.Text = "";
                QUALITYcombo.Text = "";
                QUANTITYTXT.Text = "";
                UNITCOMBO.SelectedIndex = 0;
                SELPRICETXT.Text = "";
                COSTPRICETXT.Text = "";
            }
            else
            {
                repdgv.CurrentRow.Selected = true;
                REP_ID.Text = repdgv.Rows[e.RowIndex].Cells["ID"].FormattedValue.ToString();
                ITEMcombo.Text = repdgv.Rows[e.RowIndex].Cells["item"].FormattedValue.ToString();
                nametxt.Text = repdgv.Rows[e.RowIndex].Cells["name"].FormattedValue.ToString();
                modeltxt.Text = repdgv.Rows[e.RowIndex].Cells["model"].FormattedValue.ToString();
                QUALITYcombo.Text = repdgv.Rows[e.RowIndex].Cells["quality"].FormattedValue.ToString();
                QUANTITYTXT.Text = repdgv.Rows[e.RowIndex].Cells["quantity"].FormattedValue.ToString();
                UNITCOMBO.Text = repdgv.Rows[e.RowIndex].Cells["unit"].FormattedValue.ToString();
                COSTPRICETXT.Text = repdgv.Rows[e.RowIndex].Cells["cost"].FormattedValue.ToString();
                SELPRICETXT.Text = repdgv.Rows[e.RowIndex].Cells["PRICE"].FormattedValue.ToString();
                PROFIT.Text = repdgv.Rows[e.RowIndex].Cells["profit"].FormattedValue.ToString();
            }
        }

        private void prosavebtn_Click(object sender, EventArgs e)
        {
            if (ITEMcombo.Text == "")
            {
                ITEMcombo.Focus();
            }
            else
            if (nametxt.Text == "")
            {
                nametxt.Focus();

            }
            else
            if (modeltxt.Text == "")
            {
                modeltxt.Focus();

            }
            else
            if (QUALITYcombo.Text == "")
            {
                 QUALITYcombo.Focus();

            }
            else
            if (QUANTITYTXT.Text == "")
            {
                QUANTITYTXT.Focus();

            }
            else
            if (UNITCOMBO.Text == "")
            {
                UNITCOMBO.Focus();

            }
            else
            if (COSTPRICETXT.Text == "")
            {
                COSTPRICETXT.Focus();

            }
            else
            if (SELPRICETXT.Text == "")
            {
                SELPRICETXT.Focus();

            }
            else
            if (ITEMcombo.Items.Contains(ITEMcombo.Text))
            {
                showmessage = "SAVED";

                querry = "insert into repair values('" + REP_ID.Text + "','" + ITEMcombo.Text + "','"
                    + nametxt.Text + "','" +  modeltxt.Text + "','" + QUALITYcombo.Text + "','"
                    + QUANTITYTXT.Text + "','" + UNITCOMBO.Text + "','" + COSTPRICETXT.Text + "','"
                    + SELPRICETXT.Text + "','" + PROFIT.Text + "')";
                databaseCRUD(querry, showmessage);
                dgvpop();
                clear_valu();

            }
            else
            {
                showmessage = "ITEM ADDED";
                querry = "insert into item values('" + ITEMcombo.Text + "')";
                databaseCRUD(querry, showmessage);
                dgvpop();
                clear_valu();
                get_ITEM();

            }
        }

        private void proupdatebtn_Click(object sender, EventArgs e)
        {
            showmessage = " DATA Updated";
            querry = "Update repair SET ITEM='" + ITEMcombo.Text
                        + "',name='" + nametxt.Text + "',model='" + modeltxt.Text +
                        "',quality='" + QUALITYcombo.Text + "',quantity = '" + QUANTITYTXT.Text + 
                        "',unit = '" + UNITCOMBO.Text + "',cost = '" + COSTPRICETXT.Text +
                        "',PRICE = '" + SELPRICETXT.Text+ "',profit = '" + PROFIT.Text + 
                        "'  where rep_ID= '" + REP_ID.Text + "'";
            databaseCRUD(querry, showmessage);
            clear_valu();
            dgvpop();
        }

        private void prodeletebtn_Click(object sender, EventArgs e)
        {
            showmessage = "DELETED";
            querry = "Delete mobile where MOB_ID = '" + REP_ID.Text + "'";
            databaseCRUD(querry, showmessage);

            dgvpop();
            clear_valu();
        }

        private void clear_Click(object sender, EventArgs e)
        {
            clear_valu();
        }

        private void get_ITEM()
        {

            conn = new SqlConnection(ConnectionString);
            SqlCommand sqlCmd = new SqlCommand("select * from ITEM_REP", conn);
            conn.Open();

            SqlDataReader sqlReader = sqlCmd.ExecuteReader();

            while (sqlReader.Read())
            {
                ITEMcombo.Items.Add(sqlReader["ITEM"].ToString());
            }

        }
    }
}

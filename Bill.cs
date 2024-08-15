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
using FontAwesome.Sharp;

namespace POS_MOBILE
{
    
    public partial class Bill : Form
    {

        string ConnectionString = "Data Source=shahzaib-ali;Initial Catalog=mobile_shop;Integrated Security=True";
        SqlConnection conn;
        private IconButton currentbtn;
        string[] listarr;
        string idval;
        public Bill()
        {
            InitializeComponent();

        }

        private void ActivateButton(Object sender, Color color)
        {
            if (sender != null)
            {
                DisableButton();
                currentbtn = (IconButton)sender;
                currentbtn.BackColor = Color.BurlyWood;

            }
        }

        private void DisableButton()
        {
            if (currentbtn != null)
            {

                currentbtn.BackColor = Color.FromArgb(45, 40, 80);
                currentbtn.ForeColor = Color.White;
                currentbtn.IconColor = Color.White;
            }
        }

        private void Bill_Load(object sender, EventArgs e)
        {
            fetchinvoice();
            mainlabel.Text = "MAIN";

            NEWradioButton.Checked = true;
            DateTime datetime = DateTime.Now;
            // labeldate.Text = datetime.ToString("D");
            
            get_cust();
            PAIDBYcomboBox.SelectedIndex = -1;
            
        }

        private void mobilebtn_Click(object sender, EventArgs e)
        {
            ActivateButton(sender, Color.AliceBlue);
            MAXDISCLBL.Text = "6%";
            
            mainlabel.Text = "MOBILE";
            IDtxt.Focus();
            IDtxt.Text = "";
            MODELLBL.Text = "";
            PRICETXT.Text = "PRICE";
            QTYcomboBox.SelectedIndex = -1;
            stocklbl.Text = "0";
            DISCOUNTTXT.Text = "0";


        }

        private void accesoriesbtn_Click(object sender, EventArgs e)
        {
            ActivateButton(sender, Color.AliceBlue);
            MAXDISCLBL.Text = "10%";
            mainlabel.Text = "ACCESSORIES";
            
            IDtxt.Focus();
            IDtxt.Text = "";
            MODELLBL.Text = "";
            PRICETXT.Text = "PRICE";
            QTYcomboBox.SelectedIndex = -1;
            stocklbl.Text = "0";
            DISCOUNTTXT.Text = "0";

        }
        
        private void NEWradioButton_CheckedChanged(object sender, EventArgs e)
        {
            NEWradioButton.ForeColor = Color.RosyBrown;
            PREVradioButton.ForeColor = Color.Black;
            INVOICEtxt.Enabled = false;
            INVOICEtxt.ForeColor = Color.RosyBrown;
            invoicescrhbtn.Visible = false;
            BILLlistView.Visible = true;
            BILLDGV.Visible = false;
        }

        private void PREVradioButton_CheckedChanged(object sender, EventArgs e)
        {
            PREVradioButton.ForeColor = Color.RosyBrown;
            NEWradioButton.ForeColor = Color.Black;
            INVOICEtxt.Enabled = true;
            INVOICEtxt.Focus();
            invoicescrhbtn.Visible = true;
            BILLlistView.Visible = false;
            BILLDGV.Visible = true;
            dgvpop();
        }

        private void EXPENSEBTN_Click(object sender, EventArgs e)
        {
            ActivateButton(sender, Color.AliceBlue);
            mainlabel.Text = "EXPENSES";
            IDtxt.Focus();
            IDtxt.Text = "";
            MODELLBL.Text = "";
            PRICETXT.Text = "PRICE";
            QTYcomboBox.SelectedIndex = -1;
            stocklbl.Text = "0";
            DISCOUNTTXT.Text = "0";

        }

        private void easypaisabtn_Click(object sender, EventArgs e)
        {
            ActivateButton(sender, Color.AliceBlue);
            mainlabel.Text = "EASYPAISA";
            MessageBox.Show("COMING SOON !!! ");
        }

        private void EASYLOADbtn_Click(object sender, EventArgs e)
        {
            ActivateButton(sender, Color.AliceBlue);
            mainlabel.Text = "EASYLOAD";
            MessageBox.Show("COMING SOON !!! ");
            
        }
        
        private void REPAIRBTN_Click(object sender, EventArgs e)
        {
            ActivateButton(sender, Color.AliceBlue);
            mainlabel.Text = "REPAIR";
            MAXDISCLBL.Text = "10%";
           
            IDtxt.Focus();
            IDtxt.Text = "";
            MODELLBL.Text = "";
            PRICETXT.Text = "PRICE";
            QTYcomboBox.SelectedIndex = -1;
            stocklbl.Text = "0";
            DISCOUNTTXT.Text = "0";

        }

        private void REDOBTN_Click(object sender, EventArgs e)
        {
            ActivateButton(sender, Color.AliceBlue);
            mainlabel.Text = "MAIN";
        }

        private void PAIDAMTTXT_TextChanged(object sender, EventArgs e)
        {
            try
            {


                if (PAIDAMTTXT.Text.Length > 0)
                {
                    REMAININGLBL.Text = (Convert.ToInt32(PAIDAMTTXT.Text) - Convert.ToInt32(TOTALLBL.Text)).ToString();
                }
                else
                {
                    REMAININGLBL.Text = "00000";
                    PAIDAMTTXT.Focus();
                }
            }
            catch(Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void SEARCHBTN_Click(object sender, EventArgs e)
        {
            //MODELLBL.Text = "MODEL";
            PRICETXT.Text = "PRICE";
            CLEARVAL();

            if(IDtxt.Text != "")
            {
                get_MODEL();
                get_Stock();
                get_Price();
                QTYcomboBox.SelectedIndex = 0;
                QTYcomboBox.Focus();
            }
            else
            if (MODELLBL.Text != "")
            {
                
                GET_ID();
                if(IDtxt.Text=="")
                {
                    MessageBox.Show("NO ID FOUND");
                }else
                {
                    get_Stock();
                    get_Price();
                    QTYcomboBox.SelectedIndex = 0;
                    QTYcomboBox.Focus();
                }
                
            }
            else
            {
                IDtxt.Focus();
            }
            

            
        }

        private void QTYcomboBox_SelectedIndexChanged(object sender, EventArgs e)
        {
            if(QTYcomboBox.Text=="")
            {
                
            }else
            if(int.Parse(QTYcomboBox.Text)>int.Parse(stocklbl.Text))
            {
                MessageBox.Show("YOU ARE TRYING TO EXCEED AVAILABLE QUANTITY !!!");
                QTYcomboBox.Focus();
            }
        }

        private void ADDBTN_Click(object sender, EventArgs e)
        {
            if (mainlabel.Text == "REPAIR")
            {
                TOTALLBL.Text = "00000";
                listarr = new string[6];
                listarr[0] = IDtxt.Text;
                listarr[1] = MODELLBL.Text;
                listarr[2] = PRICETXT.Text;
                listarr[3] = QTYcomboBox.Text;
                listarr[4] = DISCOUNTTXT.Text;
                listarr[5] = (int.Parse(PRICETXT.Text) * int.Parse(QTYcomboBox.Text) - int.Parse(DISCOUNTTXT.Text)).ToString();

                ListViewItem lvl = new ListViewItem(listarr);
                BILLlistView.Items.Add(lvl);

                total();
                PAIDBYcomboBox.SelectedIndex = 0;
                PAIDBYcomboBox.Focus();
                IDtxt.Text = "";
                MODELLBL.Text = "";
                QTYcomboBox.SelectedIndex = -1;
                PRICETXT.Text = "0";
                DISCOUNTTXT.Text = "0";
            }
            else
            {
                TOTALLBL.Text = "00000";
                listarr = new string[6];
                listarr[0] = IDtxt.Text;
                listarr[1] = MODELLBL.Text;
                listarr[2] = PRICETXT.Text;
                listarr[3] = QTYcomboBox.Text;
                listarr[4] = DISCOUNTTXT.Text;
                listarr[5] = (int.Parse(PRICETXT.Text) * int.Parse(QTYcomboBox.Text) - int.Parse(DISCOUNTTXT.Text)).ToString();

                ListViewItem lvl = new ListViewItem(listarr);
                BILLlistView.Items.Add(lvl);

                total();
                PAIDBYcomboBox.SelectedIndex = 0;
                PAIDBYcomboBox.Focus();
                IDtxt.Text = "";
                MODELLBL.Text = "";
                QTYcomboBox.SelectedIndex = -1;
                PRICETXT.Text = "0";
                DISCOUNTTXT.Text = "0";
            }
        }

        private void prosavebtn_Click(object sender, EventArgs e)
        {
            try
            {
                string DATE;
                DateTime dt = DateTime.Now;
                DATE = dt.ToString();
                conn = new SqlConnection(ConnectionString);
                SqlCommand cmd = null;
                string cmdString = "";
                conn.Open();
                for (int i = 0; i < BILLlistView.Items.Count; i++)
                {

                    cmdString = "insert into BILL values('" + INVOICEtxt.Text + "','"
                    + BILLlistView.Items[i].SubItems[0].Text + "','"
                    + BILLlistView.Items[i].SubItems[1].Text + "','"
                    + BILLlistView.Items[i].SubItems[2].Text + "','"
                    + BILLlistView.Items[i].SubItems[3].Text + "','"
                    + BILLlistView.Items[i].SubItems[4].Text + "','"
                    + BILLlistView.Items[i].SubItems[5].Text + "','"
                    + TOTALLBL.Text + "','"+ PAIDBYcomboBox.Text + "','" 
                    + PAIDAMTTXT.Text + "','"+ REMAININGLBL.Text + "','" 
                    + CUSTOMERcomboBox.Text + "','"+ this.dateTimePicker1.Text + "')";

                    cmd = new SqlCommand(cmdString, conn);
                    cmd.ExecuteNonQuery();
                }
                MessageBox.Show("Data Stored Successfully");
                conn.Close();
                IDtxt.Text = "";
                IDtxt.Focus();
                MODELLBL.Text = "";
                PRICETXT.Text = "PRICE";
                QTYcomboBox.SelectedIndex = -1;
                stocklbl.Text = "0";
                BILLlistView.Items.Clear();
                TOTALLBL.Text = "0000";
                CLEARVAL();
                fetchinvoice();
                
            }catch(Exception eX)
            {
                MessageBox.Show(eX.Message);
            }
           
        }

        private void PAIDBYcomboBox_SelectedIndexChanged(object sender, EventArgs e)
        {
            if(PAIDBYcomboBox.Text=="CASH" )
            {
               PAIDAMTTXT.Text= TOTALLBL.Text;
                CUSTOMERcomboBox.Focus();
            }else
                if (PAIDBYcomboBox.Text == "ACCOUNT")
            {
                PAIDAMTTXT.Text = TOTALLBL.Text;
                CUSTOMERcomboBox.Focus();
            }
            else
            {
                PAIDAMTTXT.Focus();
            }
        }

        private void prodeletebtn_Click(object sender, EventArgs e)
        {
            if(NEWradioButton.Checked == true)
            {
                BILLlistView.Items.RemoveAt(BILLlistView.SelectedIndices[0]);
                total();
                if (BILLlistView.Items.Count > 0)
                {
                    PAIDBYcomboBox.SelectedIndex = -1;
                    PAIDBYcomboBox.Focus();
                    IDtxt.Text = "";
                    MODELLBL.Text = "";
                    PRICETXT.Text = "PRICE";
                    DISCOUNTTXT.Text = "0";
                }
                else
                {
                    IDtxt.Focus();
                    IDtxt.Text = "";
                    MODELLBL.Text = "";
                    PRICETXT.Text = "PRICE";
                    QTYcomboBox.SelectedIndex = -1;
                    stocklbl.Text = "0";
                    DISCOUNTTXT.Text = "0";
                    PAIDBYcomboBox.SelectedIndex = -1;
                    PAIDAMTTXT.Text = "0";
                    REMAININGLBL.Text = "00000";
                    CUSTOMERcomboBox.SelectedIndex = -1;
                }
            }
            else
                if(PREVradioButton.Checked==true)
            {
                try
                {
                    conn = new SqlConnection(ConnectionString);
                    SqlCommand cmd = null;
                    conn.Open();
                    cmd = new SqlCommand("Delete bill where SALE_ID = '" + idval + "'", conn);
                    cmd.CommandType = CommandType.Text;
                    cmd.ExecuteNonQuery();
                    conn.Close();
                    MessageBox.Show("Successfully deleted");
                    dgvpop();

                }
                catch (Exception eC)
                {
                    MessageBox.Show(eC.Message);
                }
            }
            
                      
            
            
            
           
        }

        private void clear_Click(object sender, EventArgs e)
        {
            IDtxt.Text = "";
            MODELLBL.Text = "";
            PRICETXT.Text = "PRICE";
            QTYcomboBox.SelectedIndex = -1;
            stocklbl.Text = "0";
            BILLlistView.Items.Clear();
            TOTALLBL.Text = "0000";
            CLEARVAL();
            fetchinvoice();

        }

        private void invoicescrhbtn_Click(object sender, EventArgs e)
        {
            try
            {
                dgvpop();
            }
            catch(Exception EX)
            {
                MessageBox.Show(EX.Message);
            }
        }

        private void dgvpop()
        {
            conn = new SqlConnection(ConnectionString);
            conn.Open();

            SqlDataAdapter adapter = new SqlDataAdapter("Select * from BILL WHERE INVOICE_NO= "+INVOICEtxt.Text+"", conn);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            BILLDGV.DataSource = dt;

            conn.Close();
        }

        private void BILLDGV_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            BILLDGV.CurrentRow.Selected = true;
            idval = BILLDGV.Rows[e.RowIndex].Cells["sale_id"].FormattedValue.ToString();
            TOTALLBL.Text= BILLDGV.Rows[e.RowIndex].Cells["TOTAL"].FormattedValue.ToString();
            PAIDBYcomboBox.Text= BILLDGV.Rows[e.RowIndex].Cells["PAID_BY"].FormattedValue.ToString();
            PAIDAMTTXT.Text= BILLDGV.Rows[e.RowIndex].Cells["PAID_AMT"].FormattedValue.ToString();
            REMAININGLBL.Text= BILLDGV.Rows[e.RowIndex].Cells["BALANCE"].FormattedValue.ToString();
            CUSTOMERcomboBox.Text= BILLDGV.Rows[e.RowIndex].Cells["CUSTOMER"].FormattedValue.ToString();

        }

        private void databaseCRUD(string savequerry)
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
                MessageBox.Show("UPDATED " );
                
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
            }
        }

        void fetchinvoice()
        {
            try
            {

                SqlConnection connect = new SqlConnection(ConnectionString);
                SqlDataAdapter sda = new SqlDataAdapter("Select Invoice_no from BILL order by Invoice_no desc", connect);
                DataSet ds = new DataSet();
                sda.Fill(ds);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    INVOICEtxt.Text = (Convert.ToInt32(ds.Tables[0].Rows[0][0].ToString()) + 1).ToString();
                }
                else
                {
                    INVOICEtxt.Text = "1000";
                }


                connect.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }

        }
        void get_cust()
        {

            conn = new SqlConnection(ConnectionString);
            SqlCommand sqlCmd = new SqlCommand("select * from Customer", conn);
            conn.Open();

            SqlDataReader sqlReader = sqlCmd.ExecuteReader();

            while (sqlReader.Read())
            {
                CUSTOMERcomboBox.Items.Add(sqlReader["NAME"].ToString());
            }

        }
        void GET_ID()
        {
            conn = new SqlConnection(ConnectionString);
            SqlCommand cmddb = new SqlCommand("select ID from " + mainlabel.Text + "  where MODEL = '" + MODELLBL.Text + "'", conn);
            SqlDataReader reader;
            try
            {
                conn.Open();
                reader = cmddb.ExecuteReader();
                reader.Read();
                IDtxt.Text = reader["ID"].ToString() ;
                
                conn.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
            
        }
        void get_MODEL()
        {

            conn = new SqlConnection(ConnectionString);
            if (mainlabel.Text == "MOBILE")
            {
                SqlCommand cmddb = new SqlCommand("select MODEL from " + mainlabel.Text + "  where ID = '" + IDtxt.Text + "'", conn);
                SqlDataReader reader;
                try
                {
                    conn.Open();
                    reader = cmddb.ExecuteReader();
                    reader.Read();
                    MODELLBL.Text = reader["MODEL"].ToString();
                    conn.Close();

                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                }
            }
            else
                if (mainlabel.Text == "ACCESSORIES")
            {

                SqlCommand cmddb = new SqlCommand("select NAME, MODEL from " + mainlabel.Text + "  where ID = '" + IDtxt.Text + "'", conn);
                SqlDataReader reader;
                try
                {
                    conn.Open();
                    reader = cmddb.ExecuteReader();
                    reader.Read();
                    MODELLBL.Text = reader["NAME"].ToString() + " " + reader["MODEL"].ToString();
                    conn.Close();

                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                }
            }
            else
                if (mainlabel.Text == "REPAIR")
            {

                SqlCommand cmddb = new SqlCommand("select MODEL, ITEM from " + mainlabel.Text + "  where ID = '" + IDtxt.Text + "'", conn);
                SqlDataReader reader;
                try
                {
                    conn.Open();
                    reader = cmddb.ExecuteReader();
                    reader.Read();
                    MODELLBL.Text = reader["MODEL"].ToString() + " " + reader["ITEM"].ToString();
                    conn.Close();

                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                }

            }
            else
            {
                MessageBox.Show("PLZ SELECT YOUR REQUIRED PRODUCT CATEGORY");
            }
        }
        void get_Stock()
        {

            conn = new SqlConnection(ConnectionString);
            SqlCommand cmddb = new SqlCommand("select quantity from " + mainlabel.Text + "  where ID = '" + IDtxt.Text + "'", conn);
            SqlDataReader reader;
            try
            {
                conn.Open();
                reader = cmddb.ExecuteReader();
                reader.Read();
                stocklbl.Text = reader["quantity"].ToString();
                conn.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
        void get_Price()
        {

            conn = new SqlConnection(ConnectionString);
            SqlCommand cmddb = new SqlCommand("select PRICE from " + mainlabel.Text + "  where ID = '" + IDtxt.Text + "'", conn);
            SqlDataReader reader;
            try
            {
                conn.Open();
                reader = cmddb.ExecuteReader();
                reader.Read();
                PRICETXT.Text = reader["PRICE"].ToString();
                conn.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
        public void total()
        {
            TOTALLBL.Text = "00000";
            if (BILLlistView.Items.Count > 0)
            {
                for (int i = 0; i < BILLlistView.Items.Count; i++)
                {
                    TOTALLBL.Text = (Convert.ToInt32(TOTALLBL.Text) + Convert.ToInt32(BILLlistView.Items[i].SubItems[5].Text)).ToString();
                }
            }

        }
        public void CLEARVAL()
        {
            DISCOUNTTXT.Text = "0";
            PAIDAMTTXT.Text = "0";
            REMAININGLBL.Text = "00000";
            CUSTOMERcomboBox.SelectedIndex = -1;
        }

        private void BILLDGV_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {

        }

        private void proupdatebtn_Click(object sender, EventArgs e)
        {
            String QUERY = "Update BILL SET TOTAL = '" + TOTALLBL.Text + "',PAID_BY = '" + PAIDBYcomboBox.Text
                        + "',PAID_AMT = '" + PAIDAMTTXT.Text + "',BALANCE = '" + REMAININGLBL.Text
                        + "',CUSTOMER = '" + CUSTOMERcomboBox.Text + "'  where SALE_ID= '" + idval + "'";
            databaseCRUD(QUERY);
            dgvpop();
        }

        private void REMAININGLBL_Click(object sender, EventArgs e)
        {

        }
    }
}

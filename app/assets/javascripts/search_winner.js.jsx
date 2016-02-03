var CONFIG = {
  sort: { column: "_id", order: "desc" },
  filterText: "",
  columns: {
    _id: { name: "獎次"},
    name: { name: "獎品"},
    can_accept_prize_now: { name: "現領"},
    staff_name: {name: "姓名"},
    staff_id: {name: "工號"},
  }
};


var TableSorter = React.createClass({
  getInitialState: function() {
    return {
      items: this.props.initialItems || [],
      sort: this.props.config.sort || { column: "", order: "" },
      columns: this.props.config.columns,
      filterText:this.props.config.filterText
    };
  },

  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.dataSource,
      dataType: "json",
      success: function(data) {
        this.setState({items: data});
      }.bind(this)
    });
  },
  
  componentWillMount: function() {
    this.loadData(this.props.dataSource);
    setInterval(this.loadCommentsFromServer, 2000);
  },  
  loadData: function(dataSource) {
    if (!dataSource) return;

    $.get(dataSource).done(function(data) {
      console.log("Received data");
      this.setState({items: data});
    }.bind(this)).fail(function(error, a, b) {
      console.log("Error loading JSON");
    });
  },
  handleFilterTextChange: function (event){
    this.setState({filterText:event.target.value})
  },
  editColumnNames: function() {
     return Object.keys(this.state.columns); 
  },

  receive_click:function(event){
    name_staff=event.target.name.split(',')

    dataSource='/take/'+name_staff[0]+'/'+name_staff[1];
    $.getJSON(dataSource).done(function() {
      console.log("Input success");
    }.bind(this)).fail(function(error, a, b) {
      console.log("Error :Input Prize");
    });

    itemsColumn=_.find(this.state.items,function(column){return column['_id']==name_staff[0]});
    itemsColumn['taken_at']=true;
    this.setState()

  },
  render: function() {
    var rows = [];
    var columnNames = this.editColumnNames();
    var filters = {};

    columnNames.forEach(function(column) {
      var filterText = this.state.filterText;
      filters[column] = null;

      if (filterText.length > 0 ) {
        filters[column] = function(x) {
          if(x)
            return (x.toString().toLowerCase().indexOf(filterText.toLowerCase()) > -1);
        };
      }
    }, this);

    var filteredItems = _.filter(this.state.items, function(item) {
      return _.some(columnNames, function(c) {
        return (!filters[c] || filters[c](item[c]));
      }, this);
    }, this);

    var sortedItems = _.sortBy(filteredItems, this.state.sort.column);
    if (this.state.sort.order === "desc") sortedItems.reverse();

    var cell = function(x) {
      return columnNames.map(function(c) {
        if (c == 'taken_at') {
          if (x[c])
            return <td>
              <span className="btn btn-shadow btn-danger" disabled="disabled">已領取</span>
            </td>;
          else
            return <td>
              <button name={x['_id']+','+x['staff_id']} className="btn btn-shadow btn-success" onClick={this.receive_click}>未領取</button>
            </td>;
        }
        else if (c == 'can_accept_prize_now') {
          if (x[c] )
            return <td>
              <img src="/images/check.png"></img>
            </td>;
          else
            return <td>
              <img src="/images/cross.png"></img>
            </td>;
        }
        else
          return <td>{x[c]}</td>;
      }, this);
    }.bind(this);

    sortedItems.forEach(function(item) {
      rows.push(
        <tr key={item.id}>
          { cell(item) }
        </tr>
      );
    }.bind(this));


    var header = columnNames.map(function(c) {
      return <th >{this.state.columns[c].name}</th>;
    }, this);

    return (      
      <div className="table">
      <form>
        <fieldset>
          <input type="text" name="s" id="s" placeholder="搜尋方式：部分工號、部分姓名、部分獎次，皆可查詢。 Eg: 林 or 726 "  
          value={this.state.value} onChange={this.handleFilterTextChange}/>
        </fieldset>      
      </form>
      <p/>
      <table cellSpacing="0" className="table table-striped table-advance table-hover prizes">
        <thead>
          <tr>
            { header }
          </tr> 
        </thead>
        <tbody>
          { rows }
        </tbody>
      </table>
      </div>
    );
  }
});

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
    return query_string;
} ();

var App = React.createClass({
  render: function() {
    return (
      <div>
        <TableSorter dataSource={"/welcome/get_winner_list"} config={CONFIG} />
      </div>
    );
  }
});

$( document ).ready(function() {
    console.log( "ready!" );
    if(document.getElementById("searchWinner")){
       React.render(<App />, document.getElementById("searchWinner"));  
    }
});

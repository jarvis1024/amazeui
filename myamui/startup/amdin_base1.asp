<%
Public Sub am_pagination(byval CurrentPage, iTotal, itemPerpage )
    %>
    <ul class="am-pagination am-pagination-centered">
      <li class="am-disabled"><a href="#">&laquo;</a></li>
      <li class="am-active"><a href="#">1</a></li>
      <li><a href="#">2</a></li>
      <li><a href="#">3</a></li>
      <li> ...&nbsp; </li>
      <li><a href="#">4</a></li>
      <li><a href="#">5</a></li>
      <li><a href="#">&raquo;</a></li>
    </ul>
    <%
End Sub
%>
$("")
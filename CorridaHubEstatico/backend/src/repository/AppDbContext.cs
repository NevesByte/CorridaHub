using Microsoft.EntityFrameworkCore;
public class AppDbContext : DbContext {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    public DbSet<RequisicaoCorridaEntity> RequisicaoCorrida { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RequisicaoCorridaEntity>()
            .Property(x => x.tipoCorrida)
            .HasConversion<string>();
        
        modelBuilder.Entity<RequisicaoCorridaEntity>()
            .Property(x => x.categoriaCorredores)
            .HasConversion<string>();

        modelBuilder.Entity<RequisicaoCorridaEntity>()
            .Property(x => x.premiacao)
            .HasConversion<string>();
    }
}